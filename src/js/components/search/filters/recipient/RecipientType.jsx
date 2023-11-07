/**
 * RecipientType.jsx
 * Created by michaelbray on 5/17/17.
 */

import React from 'react';
import PropTypes from 'prop-types';

import { recipientTypes, recipientTypeGroups } from 'dataMapping/search/recipientType';
import SubmitHint from 'components/sharedComponents/filterSidebar/SubmitHint';
import RecipientTypeAccordion from "./RecipientTypeAccordion";

const defaultProps = {
    recipientTypeMapping: [
        {
            id: 'recipient-business',
            name: 'Business',
            filters: recipientTypeGroups.category_business
        },
        {
            id: 'recipient-minority-owned-business',
            name: 'Minority Owned Business',
            filters: recipientTypeGroups.category_minority_owned_business
        },
        {
            id: 'recipient-women-owned-business',
            name: 'Women Owned Business',
            filters: recipientTypeGroups.category_woman_owned_business
        },
        {
            id: 'recipient-veteran-owned-business',
            name: 'Veteran Owned Business',
            filters: recipientTypeGroups.category_veteran_owned_business
        },
        {
            id: 'recipient-special-designations',
            name: 'Special Designations',
            filters: recipientTypeGroups.category_special_designations
        },
        {
            id: 'recipient-nonprofit',
            name: 'Nonprofit',
            filters: recipientTypeGroups.category_nonprofit
        },
        {
            id: 'recipient-higher-education',
            name: 'Higher Education',
            filters: recipientTypeGroups.category_higher_education
        },
        {
            id: 'recipient-government',
            name: 'Government',
            filters: recipientTypeGroups.category_government
        },
        {
            id: 'recipient-individuals',
            name: 'Individuals',
            filters: [],
            value: recipientTypeGroups.category_individuals
        }
    ]
};

const propTypes = {
    recipientTypeMapping: PropTypes.arrayOf(PropTypes.object),
    selectedTypes: PropTypes.object,
    dirtyFilters: PropTypes.symbol
};

export default class RecipientType extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: []
        };

        this.toggleExpanded = this.toggleExpanded.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.dirtyFilters && prevProps.dirtyFilters !== this.props.dirtyFilters) {
            if (this.hint) {
                this.hint.showHint();
            }
        }
    }

    toggleExpanded(category) {
        const containsId = this.state.expanded?.indexOf(category.id);
        if (containsId <= -1) {
            this.setState({ expanded: [...this.state.expanded, category.id] });
        }
        else {
            this.setState({ expanded: this.state.expanded.filter((item) => item !== category.id) });
        }
    }

    render() {
        const checkboxTypes =
            this.props.recipientTypeMapping.map((category) =>
                (<>
                    <p>
                        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                        <span onClick={() => this.toggleExpanded(category)}>expanded&nbsp;
                            {category.name}
                        </span>
                    </p>
                    <RecipientTypeAccordion
                        expanded={this.state.expanded?.includes(category.id)}
                        selectedType={this.props.selectedTypes}
                        category={category}
                        toggleCheckboxType={this.props.toggleCheckboxType}
                        recipientTypes={recipientTypes} />
                </>)
            );

        return (
            <div className="filter-item-wrap">
                <div className="checkbox-type-filter">
                    <ul className="checkbox-types">
                        {checkboxTypes}
                    </ul>
                    <SubmitHint
                        ref={(component) => {
                            this.hint = component;
                        }} />
                </div>
            </div>
        );
    }
}

RecipientType.defaultProps = defaultProps;
RecipientType.propTypes = propTypes;
