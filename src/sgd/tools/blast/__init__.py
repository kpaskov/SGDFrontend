import json
from pyramid.response import Response
from urllib.request import Request, urlopen
# from urllib.error import URLError
from urllib.parse import urlencode

blast_url = "http://blast.dev.yeastgenome.org:8080/blast_search"

def do_blast(request):

    p = dict(request.params)

    # req = None
    # if p.get('name') and p.get('program') is None:
    #    url = blast_url + "?name=" + p.get('name')
    #    req = Request(url=url)
    # elif p.get('conf') and p.get('program') is None:
    #    url = blast_url + "?conf" + p.get('conf')
    #    req = Request(url=url)
    # else:
    #    req = Request(url=blast_url, data=request.params)

    param = {}
    for	x in p:
        param[x] = p[x]
    paramData = urlencode(param)
    req = Request(url=blast_url, data=paramData.encode('utf-8'))
    res = urlopen(req)

    data = json.loads(res.read().decode('utf-8'))

    return Response(body=json.dumps(data), content_type='application/json')


