import json
from pyramid.response import Response
from urllib2 import Request, urlopen, URLError, HTTPError

seq_url = "https://www.yeastgenome.org/backend/locus/_REPLACE_NAME_HERE_/sequence_details"
contig_url = "https://www.yeastgenome.org/backend/contig/_REPLACE_CONTIG_NAME_HERE_"
validate_url = "https://www.yeastgenome.org/backend/locus/"

def do_seq_analysis(request):

    p = dict(request.params)

    if p.get('check'):
        data = validate_name(p)
        return Response(body=json.dumps(data), content_type='application/json')

    if p.get('chr'):
        data = get_sequence_for_chr(p)
        return Response(body=json.dumps(data), content_type='application/json')

    if p.get('seq'):
        data = manipulate_sequence(p)
        return Response(body=json.dumps(data), content_type='application/json')

    data = get_sequence_for_genes(p)
    return Response(body=json.dumps(data), content_type='application/json')


def validate_name(p):

    # http://0.0.0.0:6545/run_seqtools?check=ACT1
    name = p.get('check')
    if name is None:
        return { "code": -2 }
    name = name.replace("SGD:", "")
    url = validate_url + name
    res = _get_json_from_server(url)
    if res == 404:
        return { "code": -1 }
    return { "code": 0 }

        
def get_sequence_for_chr(p):

    # http://0.0.0.0:6545/run_seqtools?chr=6&start=54696&end=53260

    data = {}
    chr = p.get('chr')
    data["chr"] = chr
    strand = '+'
    start = p.get('start')
    end = p.get('end')
    if start is not None:
        data["start"] = start
        start = int(start)
    else:
        start = 1
    if end is not None:
        data["end"] =end
        end = int(end)
    else:
        end = 10000000 # get a whole chr seq
    if start > end:
        (start, end) = (end, start)
        strand = '-'

    contig = _map_contig_name_for_chr(chr)
    seq = _get_sequence_from_contig(contig, start, end, strand)

    rev = p.get('rev')
    if rev is None or rev == '':
        rev = 0
    else:
        seq = _reverse_complement(seq)
        data['rev'] = 1
    data['residue'] = seq
        
    return data


def manipulate_sequence(p):                                                                                                                
    # http://0.0.0.0:6545/run_seqtools?seq=ATGGATTCTGGTATGTTCTAGCGCTTGCACCATCCCATTTAACTGTAA&rev=1

    data = {}
    seq = p.get('seq')
    rev = p.get('rev')
    if rev is not None:
        data['rev'] = 1
        seq = _reverse_complement(seq)
    data['residue'] = seq

    return data

    ## do more stuff here

 
def _get_sequence_from_contig(contig, start, end, strand):

    url = contig_url.replace("_REPLACE_CONTIG_NAME_HERE_", contig)
    res = _get_json_from_server(url)
    contig_name = res['display_name']
    contig_seq = res['residues']
    seq = contig_seq[start-1:end]
    if strand == '-':
        seq = _reverse_complement(seq)
    return seq


def get_sequence_for_genes(p):

    # http://0.0.0.0:6545/run_seqtools?genes=ACT1|BUD2&strains=W303|S288C&type=nuc&up=10&down=10   

    genes = p.get('genes')
    strains = p.get('strains')
    if strains is None or strains == '':
        strains = 'S288C'
    if genes is None:
        return { "ERROR": "NO GENE NAME PASSED IN" }
    genes = genes.split('|')
    strains = strains.split('|')
    rev = p.get('rev')
    up = p.get('up')
    down = p.get('down')
    if up is None or up == '':
        up = 0
    if down is None or down == '':
        down = 0
    if rev is None or rev == '':
        rev = 0

    data = {}

    for name in genes:

        name = name.replace("SGD:", "")
        url = seq_url.replace("_REPLACE_NAME_HERE_", name)
        res = _get_json_from_server(url)        

        if res == 404:
            data[name] = {}
            continue

        allSeqData = {}
        format_name = None
        if res.get('protein') is not None:
            [format_name, proteinData] = _extract_seq(strains, res['protein'], 0)
            allSeqData['protein'] = proteinData
        if res.get('coding_dna') is not None:
            [format_name, codingData] = _extract_seq(strains, res['coding_dna'], rev)
            allSeqData['coding_dna'] = codingData

        if res.get('genomic_dna') is not None:
            if up == 0 and down == 0:
                [format_name, genomicData] = _extract_seq(strains, res['genomic_dna'], rev)
                allSeqData['genomic_dna'] = genomicData
            else:
                [format_name, genomicData] = _extract_seq_with_up_down(strains, 
                                                                       res['genomic_dna'], 
                                                                       up, down, rev)
                allSeqData['genomic_dna'] = genomicData

        if format_name is not None:
            data[format_name] = allSeqData

    return data


def _extract_seq(strains, rows, rev):

    seqData = {}
    format_name = None
    for row in rows:
        strain = row['strain']
        strain_name = strain['display_name']
        if strain_name in strains:
            locus = row['locus']
            format_name = locus['format_name']
            seq = row['residues']
            if rev != 0:
                seq = _reverse_complement(seq)
            
            thisData = { "display_name": locus.get('display_name'),
                         "headline": locus.get('headline'),
                         "locus_type": locus['locus_type'],
                         "sgdid": "SGD:" + locus['link'].replace("/locus/", ""),
                         "residue": seq }
            if rev != 0:
                thisData['rev'] = 1

            seqData[strain_name] = thisData

    return [format_name, seqData]


def _extract_seq_with_up_down(strains, rows, up, down, rev):

    seqData = {}
    format_name = None
    for row in rows:
        strain = row['strain']
        strain_name = strain['display_name']
        if strain_name in strains:
            locus = row['locus']
            format_name = locus['format_name']

            start = row['start']
            end = row['end']
            strand = row['strand']
            contig = row['contig']['format_name']
            up_bp = int(up)
            down_bp = int(down)
            if strand == '-':
                (up_bp, down_bp) = (down_bp, up_bp)
            start = start - up_bp
            end = end + down_bp

            seq = _get_sequence_from_contig(contig, start, end, strand)

            if rev != 0:
                seq = _reverse_complement(seq)

            thisData = { "display_name": locus.get('display_name'),
                         "headline": locus.get('headline'),
                         "locus_type": locus['locus_type'],
                         "sgdid": "SGD:" + locus['link'].replace("/locus/", ""),
                         "residue": seq,
                         "up": up,
                         "down": down }
            if rev != 0:
                thisData['rev'] = 1

            seqData[strain_name] = thisData

    return [format_name, seqData]


def _reverse_complement(seq):

    complement = {'A': 'T', 'C': 'G', 'G': 'C', 'T': 'A'}
    bases = list(seq)
    bases = reversed([complement.get(base,base) for base in bases])
    bases = ''.join(bases)
    return bases


def _get_json_from_server(url):

    # print "URL: ", url
    
    try:
        req = Request(url)
        res = urlopen(req)
        data = json.loads(res.read())
        return data
    except HTTPError:
        return 404

             
def _map_contig_name_for_chr(chr):
    
    chr_to_contig_chrom = { '1': 'I', '2': 'II', '3': 'III', '4': 'IV', '5': 'V', 
                            '6': 'VI', '7': 'VII', '8': 'VIII', '9': 'IX', '10': 'X',
                            '11': 'XI', '12': 'XII', '13': 'XIII', '14': 'XIV',
                            '15': 'XV', '16': 'XVI', '17': 'Mito' }

    if chr in chr_to_contig_chrom:
        return 'Chromosome_' + chr_to_contig_chrom[chr]
    return chr