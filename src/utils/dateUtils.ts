import dayjs, { QUnitType } from 'dayjs';

/** interface */
interface GetDifferenceBetweenDateStringsParam {
	dateStringX: string;
	dateStringY: string;
	dateUnit?: QUnitType;
}

/**
 *
 * @dateStringX 비교 날짜 문자열 1
 * @dateStringY 비교 날짜 문자열 2
 * @dateUnit 날짜 비교 단위
 */
export const getDifferenceBetweenDateStrings = ({
	dateStringX,
	dateStringY,
	dateUnit = 'day'
}: GetDifferenceBetweenDateStringsParam): number =>
	Math.abs(Number(dayjs(dateStringX).diff(dateStringY, dateUnit)));
