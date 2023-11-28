/**
 * StatePage.jsx
 * Created by Lizzie Salita 5/2/18
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { find, throttle } from 'lodash';
import { ShareIcon, FiscalYearPicker } from 'data-transparency-ui';
import { statePageMetaTags } from 'helpers/metaTagHelper';
import { currentFiscalYear, earliestFiscalYear, getFiscalYearsWithLatestAndAll } from 'helpers/fiscalYearHelper';
import { Helmet } from 'react-helmet';
import Error from 'components/sharedComponents/Error';
import PageWrapper from 'components/sharedComponents/PageWrapper';
import { LoadingWrapper } from "components/sharedComponents/Loading";
import { getBaseUrl, handleShareOptionClick } from 'helpers/socialShare';
import { useHistory } from "react-router-dom";
import { useQueryParams } from 'helpers/queryParams';
import { stickyHeaderHeight } from 'dataMapping/stickyHeader/stickyHeader';
import { getStickyBreakPointForSidebar } from 'helpers/stickyHeaderHelper';
import StateContent from './StateContent';

const propTypes = {
    loading: PropTypes.bool,
    error: PropTypes.bool,
    id: PropTypes.string,
    stateProfile: PropTypes.object,
    pickedFy: PropTypes.func
};

const StatePage = ({
    error,
    loading,
    id,
    stateProfile = { fy: '' },
    pickedFy
}) => {
    const history = useHistory();
    const query = useQueryParams();
    const [activeSection, setActiveSection] = useState(query.section || 'overview');

    const slug = `state/${id}/${stateProfile.fy}`;
    const emailArgs = {
        subject: `USAspending.gov State Profile: ${stateProfile.overview.name}`,
        body: `View the spending activity for this state on USAspending.gov: ${getBaseUrl(slug)}`
    };

    const stateSections = [
        {
            section: 'overview',
            label: 'Overview'
        },
        {
            section: 'transactions-over-time',
            label: 'Transactions Over Time'
        },
        {
            section: 'top-five',
            label: 'Top 5'
        }
    ];
    const jumpToSection = (section = '') => {
        // we've been provided a section to jump to
        // check if it's a valid section
        const sectionObj = find(stateSections, ['section', section]);
        if (!sectionObj) return;

        // find the section in dom
        const sectionDom = document.querySelector(`#state-${sectionObj.section}`);
        if (!sectionDom) return;

        // add section to url
        history.replace(`?section=${sectionObj.section}`);

        // add offsets
        const conditionalOffset = window.scrollY < getStickyBreakPointForSidebar() ? stickyHeaderHeight : 10;
        const sectionTop = (sectionDom.offsetTop - stickyHeaderHeight - conditionalOffset);
        window.scrollTo({
            top: sectionTop - 25,
            left: 0,
            behavior: 'smooth'
        });
        setActiveSection(section);
    };

    useEffect(throttle(() => {
        // this allows the page to jump to a section on page load, when
        // using a link to open the page
        // prevents a console error about react unmounted component leak
        let isMounted = true;
        if (isMounted) {
            const urlSection = query.section;
            if (urlSection) {
                setActiveSection(urlSection);
                jumpToSection(urlSection);
            }
        }
        return () => {
            isMounted = false;
        };
    }, 100), [history, query.section]);

    let content = <StateContent id={id} stateProfile={stateProfile} />;
    if (error) {
        content = (
            <Error
                title="Invalid State"
                message="The state ID provided is invalid. Please check the ID and try again." />
        );
    }

    const handleShare = (name) => {
        handleShareOptionClick(name, slug, emailArgs);
    };

    const backgroundColor = {
        backgroundColor: "#1a4480"
    };

    return (
        <PageWrapper
            pageName="State Profile"
            classNames="usa-da-state-page"
            overLine="state profile"
            title={stateProfile.overview.name}
            metaTagProps={stateProfile.overview ? statePageMetaTags(stateProfile.overview) : {}}
            toolBarComponents={[
                <FiscalYearPicker
                    backgroundColor={backgroundColor}
                    selectedFy={stateProfile?.fy}
                    handleFyChange={pickedFy}
                    options={getFiscalYearsWithLatestAndAll(earliestFiscalYear, currentFiscalYear())} />,
                <ShareIcon
                    onShareOptionClick={handleShare}
                    url={getBaseUrl(slug)} />
            ]}
            sections={stateSections}
            activeSection={activeSection}
            jumpToSection={jumpToSection}>
            <main id="main-content" className="main-content">
                <Helmet>
                    <link href="https://api.mapbox.com/mapbox-gl-js/v2.11.1/mapbox-gl.css" rel="stylesheet" />
                </Helmet>
                <LoadingWrapper isLoading={loading}>
                    {content}
                </LoadingWrapper>
            </main>
        </PageWrapper>
    );
};

export default StatePage;

StatePage.propTypes = propTypes;
