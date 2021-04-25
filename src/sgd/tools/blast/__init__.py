import json
from pyramid.response import Response
from urllib.request import Request, urlopen
# from urllib.error import URLError
# from urllib.parse import urlencode

blast_url = "http://blast.dev.yeastgenome.org:8080/blast_search"

def do_blast(request):

    p = dict(request.params)

    req = None
    if p.get('name'):
        url = blast_url + "?name=" + p.get('name')
        req = Request(url=url)
    elif p.get('conf'):
        url = blast_url + "?conf" + p.get('conf')
        return url
    else:
        req = Request(url=blast_url, data=request.params)

    res = urlopen(req)

    data = json.loads(res.read().decode('utf-8'))

    return Response(body=json.dumps(data), content_type='application/json')


