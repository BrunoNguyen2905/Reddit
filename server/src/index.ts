//turn of tsc -w (k cho ts compiler watch) => when changes in index.ts, it doesnt update index.js
//Workflow: lam viec tren index.ts => Then, tsc-w va no se compile va nem vao ./dist, dong thoi chay nodemon server
// => se check khi ma ./dist/index.js thay doi => run again(node dist/index.js) 
require('dotenv').config()
import 'reflect-metadata'
import express from  'express'
import { createConnection } from "typeorm"
import { User } from './entities/User'
import { Post } from './entities/Post'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from './resolvers/hello'
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core' //for apollo-server-express >=3 48:40
import { UserResolver } from './resolvers/user'

const main = async () => {
    await createConnection({
        type: 'postgres',
        database: 'reddit',
        username: process.env.DB_USERNAME_DEV,
        password: process.env.DB_PASSWORD_DEV,
        logging: true,
        synchronize: true, //dont need migration, auto find entities and create in db
        entities: [User, Post]
        
    })

    const app = express()

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, UserResolver],
            validate: false
        }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]//for apollo-server-express >=3
    })

    await apolloServer.start() //for apollo-server-express >=3

    apolloServer.applyMiddleware({app, cors: false})

    const PORT = process.env.PORT || 4000
    app.listen(PORT, () => console.log(`Server started on port ${PORT}. GraphQL server started on localhost: ${PORT}${apolloServer.graphqlPath}`))
}

main().catch(error => console.log(error))
