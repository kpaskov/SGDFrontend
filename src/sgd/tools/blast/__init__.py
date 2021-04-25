import json
from pyramid.response import Response
from urllib.request import Request, urlopen
# from urllib.error import URLError
# from urllib.parse import urlencode

blast_url = "http://blast.dev.yeastgenome.org:8080/blast_search"

def do_blast(request):

    p = request.params

    req = Request(url=blast_url, data=p.encode('utf-8'))

    res = urlopen(req)

    data = json.loads(res.read().decode('utf-8'))

    return Response(body=json.dumps(data), content_type='application/json')


