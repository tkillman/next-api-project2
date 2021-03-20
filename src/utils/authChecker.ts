import { AuthChecker } from 'type-graphql';
import { IReqContext } from '~/types/IReqContext';
//import { logger } from '~/utils/loggerUtils';
import _ from 'lodash';

export const customAuthChecker: AuthChecker<IReqContext> = (
	{ root, args, context, info },
	roles
) => {
	try {
		// ROLE 구분자: USER_ID, ... 등등
		// console.log('roles:', roles);

		// 아래는 예시임, 추가 룰이 필요하면 아래에 룰에 대한 로직을 넣으면 된다.
		// USER_ID 롤에 대한 AUTH CHECK
		if (_.includes(roles, 'USER_ID')) {
			return !!context.req.session!.userId;
		}

		// EMAIL 롤에 대한 AUTH CHECK
		// if (_.includes(roles, 'EMAIL')) {
		// 	return !!context.req.session!.email;
		// }

		return true;
	} catch (ex) {
		//logger.error(`customAuthChecker Error: ${ex.message}`);
		return false;
	}
};
