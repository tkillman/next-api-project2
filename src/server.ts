import 'reflect-metadata';
//import { ApolloServer } from 'apollo-server-express';
const {ApolloServer, gql} = require('apollo-server-express');
import Express from 'express';
import { buildSchema } from 'type-graphql';
import Resolver from '~/graphql/resolver';
import cors from 'cors';
import Dotenv from 'dotenv';
import { customAuthChecker } from '~/utils/authChecker';
import _ from 'lodash';
import compression from 'compression';

Dotenv.config();

const main = async () => {
	const app = Express();

	// graphql server port 설정
	const port = process.env.GRAPHQL_SERVER_PORT!;

	//console.log('port', port);
	// 세션 설정
	//app.use(session);

	// 압축 설정
	app.use(compression());

	// cors 설정(cors 설정이 안되어 있으면, 클라이언트에 세션식별자 쿠키가 저장되지 않는다.)
	// reqOrigin: 원점이 같을 경우 undefined 가 나온다. !reqOrigin 로직으로 처리
	const originUrls = process.env.ORIGIN_URL;
	//console.log("originUrls", originUrls);
	const whitelist = originUrls?.split(',');
	app.use(
		cors({
			credentials: true,
			origin: (reqOrigin, callback) => {
				if (!reqOrigin || _.includes(whitelist, reqOrigin)) {
					callback(null, true);
				} else {
					callback(new Error('Not allowed by CORS'), false);
				}
			}
		})
	);

	// RESOLVER 가져와서 스키마에 등록
	const schema = await buildSchema({
		resolvers: Resolver,
		// resolvers: [__dirname + '/graphql/**/*.ts'],
		//authChecker: customAuthChecker,
		validate: false
	});

	const playgroundConfig = {
		settings: {
			'request.credentials': 'include'
		}
	};

	//console.log('schema', schema);

	// //서버에 스키마 등록
	const apolloServer = new ApolloServer({
		schema,
		context: ({ req }: any) => ({ req }),
		playground:
			process.env.NODE_ENV === 'development' ? playgroundConfig : false
	});

	// EXPRESS 를 미들웨어로 등록
	apolloServer.applyMiddleware({ app, cors: false });

	// 서버 LISTEN
	app.listen(port, () => {
		console.log(`server started on http://localhost:${port}/graphql`);
	});
};

main();
