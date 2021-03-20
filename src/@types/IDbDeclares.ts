import OracleDB from 'oracledb';
import MybatisMapper, { Params } from 'mybatis-mapper';

export interface IResult<T> {
	OUT_RET_CODE: string;

	OUT_RET_MSG: string;

	OUT_RESULT: T[];
}

/** 오라클 파라메터 타입 */
export type IOracleParamType =
	| OracleDB.BindParameters
	| OracleDB.BindParameters[];

export interface IQueryParams {
	/** XML 에 선언된 네임스페이스 */
	namespace: string;

	/** XML 에 선언된 sql id */
	sqlId: string;

	/** 마이바티스 format 설정 */
	format?: MybatisMapper.Format;

	/** 쿼리 */
	query?: string;

	/** 파라메터 */
	params: IOracleParamType | Params;

	/// mybatisParam?: Params;
}

interface IDBRequestBase {
	/** 결과코드 */
	resultCode?: string;

	/** 결과메시지 */
	resultMsg?: string;

	/** 수동커밋 여부 true/false, default: undefined */
	isManually?: boolean;

	/** 오라클 DB 커넥션 객체 */
	acquire?: OracleDB.Connection;
}

/** execute 시에 필요한 쿼리, 파라메터, 트렌젝션 결과 담는지 여부 true/false */
export interface IDBRequest extends IDBRequestBase {
	queryParams: IQueryParams;
}

export interface IDBRequestMultiParams extends IDBRequestBase {
	queryParams: IQueryParams[];
}
