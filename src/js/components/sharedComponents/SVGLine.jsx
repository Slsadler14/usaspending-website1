/**
 * VerticalLine.jsx -> SVGLine.jsx
 * Created by Jonathan Hill 07/05/19
 **/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';

const propTypes = {
    scale: PropTypes.func, // function to set line position
    text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array
    ]), // text to display with line
    y1: PropTypes.number, // end of line - vertical
    y2: PropTypes.number, // start of line - vertical
    x1: PropTypes.number, // start of line - horizontal
    x2: PropTypes.number, // end of line - horizontal
    min: PropTypes.number, // max possible value of x or y
    max: PropTypes.number, // max possible value of x or y
    position: PropTypes.number, // value of position
    showTextPosition: PropTypes.string, // show text left, right, and top are valid
    textY: PropTypes.number, // show text at this height
    description: PropTypes.string,
    adjustmentX: PropTypes.number, // adjust x for padding
    textClassname: PropTypes.string,
    lineClassname: PropTypes.string,
    noText: PropTypes.bool, // do not show text,
    isHorizontal: PropTypes.bool,
    graphHeight: PropTypes.number,
    onMouseMoveLine: PropTypes.func,
    onMouseLeaveLine: PropTypes.func,
    onMouseMoveText: PropTypes.func,
    onMouseLeaveText: PropTypes.func,
    verticalLineTextHeight: PropTypes.func
};

export default class SVGLine extends Component {
    constructor(props) {
        super(props);

        this.state = {
            windowWidth: null
        };
        // React will call this function when the DOM draws it ( React Callback Refs )
        const textArray = Array.isArray(props.text) ? props.text : [props.text];
        textArray.forEach((text) => {
            this[`textDiv${text}`] = null;
            this[`setTextDiv${text}`] = (element) => {
                this[`textDiv${text}`] = element;
                this.positionText(text);
            };
        });
    }

    componentDidMount() {
        this.handleWindowResize();
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }

    onMouseMoveLine = throttle(() => {
        const {
            onMouseMoveLine,
            text,
            x1,
            x2,
            y1,
            y2,
            position
        } = this.props;
        const data = {
            position: this.getLinePosition(),
            value: position,
            x1,
            x2,
            y1,
            y2
        };
        if (onMouseMoveLine) this.props.onMouseMoveLine(data, text);
    })
    onMouseLeaveLine = throttle(() => {
        const { onMouseLeaveLine } = this.props;
        if (onMouseLeaveLine) this.props.onMouseLeaveLine();
    })
    onMouseMoveText = throttle(() => {
        const { onMouseMoveText, text, position } = this.props;
        const textDiv = this[`textDiv${text}`];
        if (textDiv) {
            const data = textDiv.getBoundingClientRect();
            data.position = this.getLinePosition();
            data.value = position;
            if (onMouseMoveText) this.props.onMouseMoveText(data, text);
        }
    })
    onMouseLeaveText = throttle(() => {
        const { onMouseLeaveText } = this.props;
        if (onMouseLeaveText) this.props.onMouseLeaveText();
    })

    getLinePosition = () => {
        const {
            isHorizontal,
            graphHeight,
            position,
            adjustmentX,
            scale
        } = this.props;
        if (isHorizontal) return graphHeight - scale(position);
        return scale(position) + (adjustmentX || 0);
    }

    getMaximum = () => {
        const {
            isHorizontal,
            graphHeight,
            scale,
            max,
            adjustmentX
        } = this.props;
        if (isHorizontal) return graphHeight - scale(max);
        return scale(max) + (adjustmentX || 0);
    }
    // since we set the position of the text we need to update it on window resize
    handleWindowResize = throttle(() => {
        const windowWidth = window.innerWidth;
        if (this.state.windowWidth !== windowWidth) {
            this.setState({ windowWidth });
            const { text } = this.props;
            const textArray = Array.isArray(text) ? text : [text];
            textArray.forEach((data) => this.positionText(data));
        }
    })

    positionText = (text) => {
        const {
            scale,
            position,
            showTextPosition,
            textY,
            adjustmentX,
            noText,
            verticalLineTextHeight
        } = this.props;
        if (noText) return null;
        let positionX = scale(position || Date.now()) + (adjustmentX || 0);
        let modifiedTextY = textY;
        const textDiv = this[`textDiv${text}`];
        if (textDiv) {
            const wordIndex = textDiv.getAttribute('data-wordindex');
            const textDivDimensions = textDiv.getBoundingClientRect();
            const width = textDivDimensions.width;
            if (showTextPosition === 'left') positionX -= (width + 4);
            if (showTextPosition === 'right') positionX += 4;
            if (showTextPosition === 'top') {
                modifiedTextY -= 15;
                positionX -= (width / 2);
            }
            if (wordIndex !== '0') {
                modifiedTextY += (textDivDimensions.height * (parseInt(wordIndex, 10)));
            }
            if (verticalLineTextHeight) verticalLineTextHeight(textDivDimensions.height);
        }
        return this.setState({ [`${text}TextX`]: positionX, [`${text}TextY`]: modifiedTextY });
    }

    line = () => {
        const {
            min,
            position,
            scale,
            x1,
            x2,
            y1,
            y2,
            lineClassname,
            isHorizontal
        } = this.props;
        if (!position) return null;
        const linePosition = this.getLinePosition();
        const minimum = scale(min);
        const maximum = this.getMaximum();
        if ((linePosition > maximum) || (linePosition < minimum)) return null;
        const classname = lineClassname ? `svg-line ${lineClassname}` : 'svg-line';
        return (
            <line
                className={classname}
                x1={isHorizontal ? x1 : linePosition}
                x2={isHorizontal ? x2 : linePosition}
                y1={isHorizontal ? linePosition : y1}
                y2={isHorizontal ? linePosition : y2}
                onMouseMove={this.onMouseMoveLine}
                onMouseLeave={this.onMouseLeaveLine} />
        );
    }

    text = (lineIsDisplayed) => {
        const { text, textClassname } = this.props;
        if (!lineIsDisplayed || !text) return null;
        const textArray = Array.isArray(text) ? text : [text];
        const classname = textClassname ? `svg-line__text ${textClassname}` : 'svg-line__text';
        return textArray.map((data, i) => (
            <text
                key={data}
                tabIndex="0"
                className={classname}
                x={this.state[`${data}TextX`]}
                y={this.state[`${data}TextY`] || this.props.textY}
                ref={this[`setTextDiv${data}`]}
                data-wordindex={i}
                onMouseMove={this.onMouseMoveText}
                onMouseLeave={this.onMouseLeaveText}>
                {data}
            </text>
        ));
    }

    description = () => (this.props.description ||
        `A ${this.props.isHorizontal ? 'horizontal' : 'vertical'} line representing today's date`);
    render() {
        const line = this.line();
        const text = this.text(line);
        return (
            <g className="svg-line__container" tabIndex="0">
                <desc>{this.description()}</desc>
                {text}
                {line}
            </g>
        );
    }
}

SVGLine.propTypes = propTypes;
