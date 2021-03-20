import MybatisMapper, { Params } from 'mybatis-mapper';
import Path from 'path';
//import { logger } from './loggerUtils';
import {
	execIUD,
	execSelect,
	execParallel,
	execMany,
	execProc,
	setRollback,
	outCursorResult
} from './oraUtils';
import {
	IQueryParams,
	IDBRequest,
	IResult,
	IDBRequestMultiParams
} from '~/types/IDbDeclares';
import OracleDB from 'oracledb';
import _ from 'lodash';

/**
 * XML 쿼리 파일과 맵핑
 * @param mapperFileName 마이바티스 쿼리파일명(ex. GetCallCenterListMapper.xml 이면 GetCallCenterListMapper만 입력)
 */
export const setMapper = (folderName: string, mapperFileName: string) => {
	const sqlFilePath = Path.join(
		process.env.MYBATIS_QUERY_PATH!,
		folderName,
		`${mapperFileName}.xml`
	);

	MybatisMapper.createMapper([sqlFilePath]);
};

/** 마이바티스 쿼리 가져오기 */
export const getQuery = (args: IQueryParams): string | undefined => {
	try {
		// 쿼리파일이 있는 폴더명 및 파일명 가져오기
		const isSubFolder = args.namespace.indexOf('.') > -1;
		const arrPath = args.namespace.split('.');
		const sqlFolderName = isSubFolder ? arrPath[0] : '';
		const sqlFileName = isSubFolder ? arrPath[1] : args.namespace;
		const isParamsArray = Array.isArray(args.params);

		// 마이바티스 쿼리파일과 맵핑
		setMapper(sqlFolderName, sqlFileName);

		// 참고:
		// execute many 같은 로직은 하나의 쿼리에 여러개의 파라메터를 가지고
		// 배치 수행하는 로직이므로 쿼리파라메터가 array 일 경우는
		// 마이바티스쪽에 파라메터 값을 보내지 않게한다.

		// 쿼리문 가져오기
		const query = MybatisMapper.getStatement(
			args.namespace,
			args.sqlId,
			// undefined,
			// 파라메터가 array 형태일 경우
			!isParamsArray ? (args.params as Params) : undefined,
			args.format
		);

		// args.params 중 query 에 있는 DB param 명에는 없는 param 이 있으면 제거 한다
		// 마이바티스용 파라메터를 제거하는 용도
		if (!Array.isArray(args.params)) {
			Object.keys(args.params).map(key => {
				if (query.indexOf(':' + key) === -1) {
					delete (args.params as Params)[key];
				}
			});
		}

		// query return
		return query;
	} catch (ex) {
		//logger.error(`getQuery Error: ${ex.message}`);
		return undefined;
	}
};

/** 프로시저 수행 */
export const getExecProcResult = async <T>(
	args: IDBRequest
): Promise<IResult<T>> => {
	let result: IResult<T> = {
		OUT_RET_CODE: args.resultCode ? args.resultCode : '00',
		OUT_RET_MSG: args.resultMsg ? args.resultMsg : '정상',
		OUT_RESULT: []
	};

	try {
		// 쿼리문 가져오기
		const queryParams: IQueryParams = args.queryParams;
		queryParams.query = getQuery(queryParams)!;

		// 프로시저 수행
		result = await execProc<T>(args);

		// 프로시저 수행 결과에 OUT_RET_CODE, OUT_RET_MSG 를 담게 함
		const procOutRetCode = result.OUT_RESULT.length > 0  && (result.OUT_RESULT[0] as any).OUT_RET_CODE ? (result.OUT_RESULT[0] as any).OUT_RET_CODE : '';
		const procOutRetMsg = procOutRetCode && procOutRetCode !== '00' ? (result.OUT_RESULT[0] as any).OUT_RET_MSG : '';

		if (procOutRetCode && procOutRetCode !== '00') {			
			result.OUT_RET_CODE = procOutRetCode;
			result.OUT_RET_MSG = procOutRetMsg;
		}

	} catch (ex) {
		// logger.error(
		// 	`getExecProcResult Error: ${ex.message}\r\nqueryParams: ${JSON.stringify(args.queryParams)}`
		// );

		result.OUT_RET_CODE = '99';
		result.OUT_RET_MSG = ex.message;

		throw result;
	}

	return result;
};

/**
 * 마이바티스 쿼리 수행 및 아웃파라메터값 반환
 * @param query 쿼리문
 * @param params T 형태의 파라메터 넘김
 */
export const getExecSelectResult = async <T>(
	args: IDBRequest
): Promise<IResult<T>> => {
	let result: IResult<T> = {
		OUT_RET_CODE: args.resultCode ? args.resultCode : '00',
		OUT_RET_MSG: args.resultMsg ? args.resultMsg : '정상',
		OUT_RESULT: []
	};

	try {
		// 쿼리문 가져오기
		const queryParams: IQueryParams = args.queryParams;
		queryParams.query = getQuery(queryParams)!;

		result = await execSelect<T>(args);
	} catch (ex) {
		// logger.error(
		// 	`getExecResult Error: ${ex.message}\r\nqueryParams: ${JSON.stringify(
		// 		args.queryParams
		// 	)}`
		// );

		result.OUT_RET_CODE = '99';
		result.OUT_RET_MSG = ex.message;

		throw result;
	}

	return result;
};

/** 기본 INSERT, UPDATE, DELETE 쿼리 수행 */
export const getExecIUDResult = async (
	args: IDBRequest
): Promise<IResult<any>> => {
	let result: IResult<any> = {
		OUT_RET_CODE: args.resultCode ? args.resultCode : '00',
		OUT_RET_MSG: args.resultMsg ? args.resultMsg : '정상',
		OUT_RESULT: []
	};

	try {
		// 쿼리문 가져오기
		const queryParams: IQueryParams = args.queryParams;
		queryParams.query = getQuery(queryParams)!;

		// 쿼리 수행
		result = await execIUD(args);
	} catch (ex) {
		// logger.error(
		// 	`getExecIUDResult Error: ${
		// 	ex.message
		// 	}\r\nqueryParams: ${JSON.stringify(args.queryParams)}`
		// );

		result.OUT_RET_CODE = '99';
		result.OUT_RET_MSG = ex.message;

		throw result;
	}

	return result;
};

/** 쿼리 여러개 받아서 한번에 처리 */
export const getExecParallelResult = async (
	args: IDBRequestMultiParams
): Promise<IResult<any>> => {
	let result: IResult<any> = {
		OUT_RET_CODE: args.resultCode ? args.resultCode : '00',
		OUT_RET_MSG: args.resultMsg ? args.resultMsg : '정상',
		OUT_RESULT: []
	};

	try {
		args.queryParams.map((value, index) => {
			value.query = getQuery(value);
		});

		result = await execParallel(args);
	} catch (ex) {
		// logger.error(
		// 	`getExecParallelResult Error: ${
		// 	ex.message
		// 	}\r\nqueryParams: ${JSON.stringify(args.queryParams)}`
		// );

		result.OUT_RET_CODE = '99';
		result.OUT_RET_MSG = ex.message;

		throw result;
	}

	return result;
};

/** 다수의 파라메터에 대한 단일 쿼리 수행(executeMany) */
export const getExecManyResult = async (
	args: IDBRequest
): Promise<IResult<any>> => {
	let result: IResult<any> = {
		OUT_RET_CODE: args.resultCode ? args.resultCode : '00',
		OUT_RET_MSG: args.resultMsg ? args.resultMsg : '정상',
		OUT_RESULT: []
	};

	try {
		// 쿼리문 가져오기
		const queryParams: IQueryParams = args.queryParams;
		queryParams.query = getQuery(queryParams)!;

		// 쿼리 수행
		result = await execMany(args);
	} catch (ex) {
		// logger.error(
		// 	`getExecManyResult Error: ${
		// 	ex.message
		// 	}\r\nqueryParams: ${JSON.stringify(args.queryParams)}`
		// );

		result.OUT_RET_CODE = '99';
		result.OUT_RET_MSG = ex.message;

		throw result;
	}

	return result;
};

/** 하나의 프로시저에 배열로 파라메터를 받아 여러번 수행할 경우
 * sc1200_Resulver > sc1200SetMultiShopIdProcSave 참고
 */
export const getExecProcMany = async (
	data: any[],
	acquire: OracleDB.Connection,
	result: any,
	namespace: string,
	sqlId: string
) => {
	return Promise.all(
		_.map(data, async val => {
			const args: IDBRequest = {
				queryParams: {
					namespace,
					sqlId,
					params: { ...val }
				},
				isManually: true,
				acquire
			};

			const procResult = await getExecProcResult(args);

			// OUT_RESULT[] 에 프로시저 결과값을 PUSH
			result.OUT_RESULT!.push(procResult.OUT_RESULT![0]);

			return procResult.OUT_RESULT![0];
		})
	);
};

/** 에러 체크해서 에러면 롤백처리(getExecProcMany() 함수 사용시에 쓰임) */
export const getErrorCheck = async (
	resultObj: any,
	acq: OracleDB.Connection
) => {
	const errorResult = _.filter(
		resultObj.OUT_RESULT,
		val => val.OUT_RET_CODE !== '00'
	);

	if (errorResult.length > 0) {
		resultObj.OUT_RET_CODE = '99';
		resultObj.OUT_RET_MSG = errorResult[0].OUT_RET_MSG;

		// rollback & 자원해제
		await setRollback(acq);

		return true;
	} else {
		return false;
	}
};
