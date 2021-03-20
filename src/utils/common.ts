import { getDifferenceBetweenDateStrings } from './dateUtils';

/** interface */
interface GetParallelTypeParam {
	fromDateString: string;
	toDateString: string;
}

/** type */
type ParallelType = 'T' | 'F';

/**
 *
 * @fromDateString 시작일 문자열
 * @toDateString 종료일 문자열
 * 시작-종료일을 받아서 차이가 3일 이상이면 'T' 아니면 'F' 반환
 */
export const getParallelType = ({
	fromDateString,
	toDateString
}: GetParallelTypeParam): ParallelType => {
	const IS_PARALLEL_TYPE = 'T';
	const IS_NOT_PARALLEL_TYPE = 'F';
	/** (종료일 - 시작일) 차이 기준 값 */
	const DAY_DIFFERENCE_BREAK_POINT = 3;

	const dayDifference = getDifferenceBetweenDateStrings({
		dateStringX: fromDateString,
		dateStringY: toDateString
	});

	return dayDifference >= DAY_DIFFERENCE_BREAK_POINT
		? IS_PARALLEL_TYPE
		: IS_NOT_PARALLEL_TYPE;
};
