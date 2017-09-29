import string
import re
import os
import pusher
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from zope.sqlalchemy import ZopeTransactionExtension

def link_gene_names(raw, locus_names_ids):
    # first create an object with display_name as key and sgdid as value
    locus_names_object = {}
    for d in locus_names_ids:
        display_name = d[0]
        sgdid = d[1]
        locus_names_object[display_name] = sgdid
    processed = raw
    words = raw.split(' ')
    for p_original_word in words:
        original_word = p_original_word#.translate(string.punctuation)
        wupper = original_word.upper()
        if wupper in locus_names_object.keys() and len(wupper) > 3:
            sgdid = locus_names_object[wupper]
            url = '/locus/'  + sgdid
            new_str = '<a href="' + url + '">' + wupper + '</a>'
            processed = processed.replace(original_word, new_str)
    return processed

# take pipe separated list and return list of integers
def process_pmid_list(raw):
    raw = raw.strip()
    if len(raw) == 0:
        return []
    p_list = re.split('\||,', raw)
    try:
        return [int(x) for x in p_list]
    except ValueError, e:
        raise ValueError('PMIDs must be a pipe-separated list of valid PMIDs.')

def get_curator_session(username):
    engine = create_engine(os.environ['NEX2_URI'])
    Session = sessionmaker(bind=engine, extension=ZopeTransactionExtension())
    curator_session = Session()
    curator_session.execute('SET LOCAL ROLE ' + username)
    return curator_session

def get_pusher_client():
    pusher_client = pusher.Pusher(
        app_id=os.environ['PUSHER_APP_ID'],
        key=os.environ['PUSHER_KEY'],
        secret=os.environ['PUSHER_SECRET'],
        ssl=True
    )
    return pusher_client
