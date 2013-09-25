'''
Created on Mar 15, 2013

@author: kpaskov
'''
from pyramid.response import Response
from pyramid.view import view_config
from sgdfrontend import evaluate_url
from sgdfrontend.link_maker import regulation_graph_link, analyze_link, \
    regulation_overview_link, regulation_details_link, download_table_link, \
    protein_domain_details_link, binding_site_details_link


'''
-------------------------------Views---------------------------------------
'''
@view_config(route_name='regulations', renderer='templates/regulation_details.jinja2')
def regulations(request):
    #Need an interaction evidence page based on a bioent
    bioent = evaluate_url(request)
    
    if bioent is None:
        return Response(status_int=500, body='Bioent could not be found.')
    
    bioent_type = bioent['bioent_type']
        
    bioent_id = str(bioent['id'])
    display_name = bioent['display_name']
    page = {
                'regulation_overview_link': regulation_overview_link(bioent_id, bioent_type),
                'regulation_details_link': regulation_details_link(bioent_id, bioent_type),
                'regulation_graph_link': regulation_graph_link(bioent_id, bioent_type),
                'protein_domain_details_link': protein_domain_details_link(bioent_id, bioent_type),
                'binding_site_details_link': binding_site_details_link(bioent_id, bioent_type),
    
                'download_table_link': download_table_link(),

                'targets_filename': display_name + '_targets',
                'regulators_filename': display_name + '_regulators',
                'domains_filename': display_name + '_domains',
                
                'analyze_link': analyze_link(),
                
                'display_name': bioent['display_name'],
                'link': bioent['link'],
                'format_name': bioent['format_name']
                }
    return page
