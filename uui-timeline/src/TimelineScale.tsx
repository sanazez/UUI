import * as React from 'react';
import cx from 'classnames';
import { TimelineTransform } from './TimelineTransform';
import styles from './TimelineScale.module.scss';

import { ReactComponent as ArrowLeftSvg } from './arrowLeft.svg';
import { ReactComponent as ArrowRightSvg } from './arrowRight.svg';
import { Icon } from '@epam/uui-core';
import { Svg } from '@epam/uui-components';
import { useCallback, useEffect, useRef } from 'react';
import { Canvas, CanvasProps } from './Canvas';
import { useTimelineTransform } from './useTimelineTransform';
import { TimelineScaleFonts, timelineScale } from './draw';

export interface TimelineScaleProps extends CanvasProps, TimelineScaleFonts {
    isDraggable?: boolean;
    isScaleChangeOnWheel?: boolean;
    shiftPercent?: number;
}

export function TimelineScale({
    timelineController,
    isDraggable,
    isScaleChangeOnWheel,
    draw: propsDraw,
    periodFont = timelineScale.defaultFonts.periodFont,
    currentPeriodFont = timelineScale.defaultFonts.currentPeriodFont,
    meridiemFont = timelineScale.defaultFonts.meridiemFont,
}: TimelineScaleProps) {
    const isMouseDownRef = useRef(false);
    
    const handleWindowMouseUp = useCallback(() => {
        if (isMouseDownRef.current) {
            isMouseDownRef.current = false;
        }
    }, []);

    const timelineTransform = useTimelineTransform({ timelineController });

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        timelineController.startDrag(e);
        isMouseDownRef.current = true;
    }, [timelineController]);

    const handleWheel = (e: React.SyntheticEvent<HTMLCanvasElement>) => {
        timelineController.handleWheelEvent(e.nativeEvent as WheelEvent);
    };

    const renderArrow = (direction: 'left' | 'right') => {
        const handleClick = () => {
            timelineController.moveBy(direction === 'left' ? -1 : 1);
        };

        const renderArrowIcon = (svg: Icon) => {
            return <Svg svg={ svg } cx={ styles.arrowIcon } />;
        };

        return (
            <div className={ cx(styles.arrow, direction == 'left' ? styles.arrowLeft : styles.arrowRight) } onClick={ handleClick }>
                {renderArrowIcon(direction === 'left' ? ArrowLeftSvg : ArrowRightSvg)}
            </div>
        );
    };

    const draw = (context: CanvasRenderingContext2D, t: TimelineTransform) => {
        context.clearRect(0, 0, t.widthMs, 60);

        timelineScale.drawBottomBorderScale({ context, canvasHeight: 60, timelineTransform: t });

        const fonts = { currentPeriodFont, periodFont, meridiemFont };
        const commonProps = { context, timelineTransform: t, ...fonts };
        timelineScale.drawPeriod({ minPxPerDay: 40000, maxPxPerDay: null, draw: timelineScale.drawMinutes, ...commonProps });
        timelineScale.drawPeriod({ minPxPerDay: 800, maxPxPerDay: 40000, draw: timelineScale.drawRemainingHours, ...commonProps });
        timelineScale.drawPeriod({ minPxPerDay: 200, maxPxPerDay: 20000, draw: timelineScale.drawHours, ...commonProps });
        timelineScale.drawPeriod({ minPxPerDay: 200, maxPxPerDay: null, draw: timelineScale.drawTopDays, ...commonProps });
        timelineScale.drawPeriod({ minPxPerDay: 20, maxPxPerDay: 200, draw: timelineScale.drawDays, ...commonProps });
        timelineScale.drawPeriod({ minPxPerDay: 6, maxPxPerDay: 200, draw: timelineScale.drawTopMonths, ...commonProps });
        timelineScale.drawPeriod({ minPxPerDay: 6, maxPxPerDay: 20, draw: timelineScale.drawWeeks, ...commonProps });
        timelineScale.drawPeriod({ minPxPerDay: 1, maxPxPerDay: 6, draw: timelineScale.drawBottomMonths, ...commonProps });
        timelineScale.drawPeriod({ minPxPerDay: null, maxPxPerDay: 6, draw: timelineScale.drawYears, ...commonProps });
    };

    useEffect(() => {
        window.addEventListener('mouseup', handleWindowMouseUp);
        
        return () => {
            window.removeEventListener('mouseup', handleWindowMouseUp);
        };
    }, [handleWindowMouseUp]);
  
    return (
        <div className={ styles.timelineHeader } style={ { width: timelineTransform.widthPx } }>
            {!isMouseDownRef.current && renderArrow('left')}
            {!isMouseDownRef.current && renderArrow('right')}
            <Canvas
                className={ isMouseDownRef.current ? styles.timelineScaleGrabbing : styles.timelineScale }
                onMouseDown={ isDraggable && handleMouseDown }
                onWheel={ isScaleChangeOnWheel && handleWheel }
                draw={ propsDraw ?? draw }
                timelineController={ timelineController }
            />
        </div>
    );
}
