import React, { Component } from 'react';

import { fetchArtifactList, SEARCH_PAGE_LIST } from '../actions';

import ContentCardsContainer from './ContentCardsContainer.js';
import {connect} from "react-redux";

class SearchPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            searchTerm: ''
        }
    }

	static getDerivedStateFromProps(nextProps, prevState){
	    console.log("searchpage: GETDERIVEDSTATEFROMPROPS")
		if (prevState.searchTerm !== nextProps.match.params.id)
            nextProps.dispatch(fetchArtifactList(nextProps.Core, SEARCH_PAGE_LIST, { "search-for": nextProps.match.params.id }))

        return {
		    searchTerm: nextProps.match.params.id
        }
	}

	render() {
		return (
			<ContentCardsContainer
				title={"Search Results"}
				content={this.props.content}
			/>
		);
	}
}

function mapStateToProps(state) {
    return {
        content: state.ArtifactLists[SEARCH_PAGE_LIST],
        Core: state.Core.Core
    }
}

export default connect(mapStateToProps)(SearchPage);