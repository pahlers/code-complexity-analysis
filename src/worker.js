import {ThreadWorker} from 'poolifier';
import { calculateCyclomaticComplexity, calculateHalstead, calculateMaintainability, calculateSloc } from 'ts-complex';

export function getMetrics(path = '') {
    return {
        path,
        maintainability: calculateMaintainability(path),
        cyclomaticComplexity: calculateCyclomaticComplexity(path),
        halstead: calculateHalstead(path),
        sloc: calculateSloc(path)
    };
}

export default new ThreadWorker(getMetrics, {
    maxInactiveTime: 60000
});
