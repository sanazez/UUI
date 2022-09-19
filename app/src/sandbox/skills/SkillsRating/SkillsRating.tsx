import * as React from 'react';
import * as css from './SkillsRating.scss';
import { SkillsBaseRating, BaseRatingProps } from './SkillsBaseRating';
import { IconContainer, TooltipProps } from "@epam/uui-components";

export interface RatingProps extends BaseRatingProps<number> {
    filledStarIcon?: any;
    emptyStarIcon?: any;
    hideTooltip?: boolean;
    hint?: (value: number) => string;
    Tooltip?: React.ComponentType<TooltipProps>;
}

const uuiRating: Record<string, string> = {
    rating: 'uui-rating',
    star: 'uui-rating-star',
    emptyStarContainer: 'uui-rating-empty-star-container',
    filledStarContainer: 'uui-rating-filled-star-container',
};

const maxValue = 5;

export class SkillsRating extends React.Component<RatingProps> {
    getFilledStarsWidth = (rating: number, markWidth: number): number => {
        const step = this.props.step || 1;
        return !!rating ? rating / step * markWidth : 0;
    }

    hidingTooltip = (rating: number): null | string => {
        if (this.props.hideTooltip) {
            return null;
        } else {
            return this.props.hint ? this.props.hint(rating) : `${rating} / ${maxValue}`;
        }
    }

    getEmptyStars = (rating: number) => {
        const Tooltip = this.props.Tooltip;
        const emptyStars = [];

        for (let i = 0; i < maxValue; i++) {
            Tooltip && emptyStars.push(
                <Tooltip key={ "star-" + i } placement='top' content={ this.hidingTooltip(rating) } cx={ css.tooltip } >
                    <div className={ uuiRating.star }>
                        { <IconContainer icon={ this.props.emptyStarIcon }/> }
                    </div>
                </Tooltip>,
            );
        }
        return emptyStars;
    }

    getFilledStars = (rating: number) => {
        const Tooltip = this.props.Tooltip;
        const filledStars = [];

        for (let i = 0; i < maxValue; i++) {
            Tooltip && filledStars.push(
                <Tooltip key={ i } placement='top' content={ this.hidingTooltip(rating) } cx={ css.tooltip }>
                    <div className={ uuiRating.star }>
                        { <IconContainer icon={ this.props.filledStarIcon } /> }
                    </div>
                </Tooltip>,
            );
        }
        return filledStars;
    }

    renderRating = (rating: number, markWidth: number) => {
        return (
            <div key={ rating } className={ css.container }>
                <div key='e' className={ uuiRating.emptyStarContainer }>
                    { this.getEmptyStars(rating) }
                </div>
                <div key='f' className={ uuiRating.filledStarContainer } style={ { width: this.getFilledStarsWidth(rating, markWidth) } }>
                    { this.getFilledStars(rating) }
                </div>
            </div>
        );
    }

    render () {
        return (
            <SkillsBaseRating
                { ...this.props }
                from={ this.props.step || 1 }
                to={ maxValue }
                step={ this.props.step }
                renderRating={ this.renderRating }
            />
        );
    }
}