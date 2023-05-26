/**
 * MobileTop.jsx
 * Created by Kevin Li 9/29/17
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Analytics from 'helpers/analytics/Analytics';

import { Close } from 'components/sharedComponents/icons/Icons';

const clickedHeaderLink = (route) => {
    Analytics.event({
        category: 'Header - Link',
        action: route
    });
};

export default class MobileTop extends React.Component {
    constructor(props) {
        super(props);

        this.clickedLink = this.clickedLink.bind(this);
    }

    clickedLink(e) {
        clickedHeaderLink('/');
        this.props.hideMobileNav(e);
    }

    render() {
        return (
            <div className="mobile-nav-header">
                <div style={this.props.detailMobileNavIsHidden ? {} : { display: "none" }} className="mobile-nav-header__logo site-logo">
                    <div className="site-logo__wrapper" id="logo-nav">
                        <Link
                            className="site-logo__link"
                            to="/"
                            title="USAspending.gov Home"
                            aria-label="USAspending.gov Home"
                            onClick={(e) => this.clickedLink(e)}>
                            <img
                                className="site-logo__image"
                                src="img/logo.png"
                                srcSet="img/logo.png 1x, img/logo@2x.png 2x"
                                alt="USAspending.gov" />
                        </Link>
                    </div>
                </div>
                <div style={this.props.detailMobileNavIsHidden ? { display: "none" } : {}}>
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                    <div onClick={() => this.props.closeDetailedMobileNav()}>Back</div>
                </div>
                <div className="mobile-nav-header__close">
                    <button
                        className="mobile-nav-header__close-button"
                        title="Close menu"
                        aria-label="Close menu"
                        onClick={(e) => this.props.hideMobileNav(e)}>
                        <Close alt="Close menu" />
                    </button>
                </div>
            </div>
        );
    }
}

MobileTop.propTypes = {
    hideMobileNav: PropTypes.func
};
