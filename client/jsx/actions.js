require('isomorphic-fetch');
const RESULTS_URL = '/backend/get_search_results';
const AUTOCOMPLETE_URL = '/backend/autocomplete_results';
const RESULTS_FACTOR = 3; // search n times results as shown per page

// helper methods
const fetchFromApi = function (url) {
  return fetch(url)
    .then(function(response) {
      console.log(response.status)
      if (response.status >= 400) {
          throw new Error('API error.');
      }
      return response.json();
    });
};
const getCategoryDisplayName = function (key) {
  const labels = {
    locus: 'Loci',
    reference: 'References',
    cellular_component: 'Cellular Components',
    molecular_function: 'Molecular Functions',
    biological_process: 'Biological Processes',
    phenotype: 'Phenotypes',
    strain: 'Strains',
    author: 'Authors'
  };
  return labels[key];
}

export function setUserInput (newValue) {
  return {
    type: 'SET_USER_INPUT',
    value: newValue
  };
};

export function startSearchFetch (_query) {
  return {
    type: 'START_SEARCH_FETCH',
    query: _query
  };
};

export function receiveSearchResponse (_response) {
  return {
    type: 'SEARCH_RESPONSE',
    response: _response
  };
};

export function fetchSearchResults (query, isAppendingResults) {
  return function (dispatch, getState) {
    let state = getState().searchResults;
    query = query || state.query;
    // stringify aggregations for url
    let selectedAggs = state.aggregations
      .filter( d => { return d.isActive; })
      .map( d => { return d.key; });
    let aggQueryParam = selectedAggs.length === 0 ? '' : `categories=${selectedAggs.join()}`;
    // offset and limit for paginate
    let offsetStart = (state.currentPage === 0 ? 0 : 1);
    let _offset = (state.currentPage + offsetStart) * state.resultsPerPage;
    let _limit = state.resultsPerPage * RESULTS_FACTOR;
    let url = `${RESULTS_URL}?q=${query}&${aggQueryParam}&limit=${_limit}&offset=${_offset}`;
    const AUTOCOMPLETE_URL = '/backend/autocomplete_results';
    fetchFromApi(url)
      .then( response => {
        console.log(response)
        response.aggregations = response.aggregations.map( d => {
          d.key = d.name;
          d.name = getCategoryDisplayName(d.name);
          return d;
        });
        response.results = response.results.map( d => {
          d.category = getCategoryDisplayName(d.category);
          return d;
        });
        if (isAppendingResults) {
          return dispatch(receiveExtraSearchResponse(response))
        } else {
          return dispatch(receiveSearchResponse(response));
        } 
      });
  }
};

export function paginate (_number) {
  return {
    type: 'PAGINATE',
    number: _number
  };
};

// get data for other pages
export function receiveExtraSearchResponse (_response) {
  return {
    type: 'EXTRA_SEARCH_RESPONSE',
    response: _response
  };
};

// if will need to fetch after next page, dispatch extra fetch
export function maybeFetchExtraResponses() {
  return function (dispatch, getState) {
    let state = getState().searchResults;
    // if one page (or less) of extra data, fetch more
    let desiredResultsNum = Math.min(state.total, (state.currentPage + 2) * state.resultsPerPage);
    if (state.results.length < desiredResultsNum) {
      dispatch(fetchSearchResults(state.query, true));
    } else {
      return;
    }
  }
}

export function toggleAgg (_key) {
  return {
    type: 'TOGGLE_AGG',
    key: _key
  };
};

export function fetchAutocompleteResults () {
  return function (dispatch, getState) {
    // TEMP don't fetch just hardcode
    let response = {  
     "results":[  
        {  
           "category":"suggestion",
           "name":"ACTin"
        },
        {  
           "href":"/go/GO:0019211/overview",
           "category":"GO",
           "name":"phosphatase activator activity"
        },
        {  
           "href":"/go/GO:0044692/overview",
           "category":"GO",
           "name":"exoribonuclease activator activity"
        },
        {  
           "href":"/go/GO:0005096/overview",
           "category":"GO",
           "name":"GTPase activator activity"
        }
      ]
    };
    let action = receiveAutocompleteResponse(response.results);
    return dispatch(action);
  };
};

export function receiveAutocompleteResponse (_response) {
  return {
    type: 'AUTOCOMPLETE_RESPONSE',
    value: _response
  };
};
