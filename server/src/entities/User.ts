import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType() //noi chuyen tu typescript => graphQL
@Entity() //db table => create a table in db //noi chuyen tu typescript => postgresSQL
export class User extends BaseEntity {
    //typeorm has decorator to change from ts to postgres language
    @Field(_type => ID)
    @PrimaryGeneratedColumn() //auto increase 1, 2, 3,..
    id!: Number

    @Field()
    @Column({unique: true}) //Column: decorator, unique: options passed to decorator
    username!: string

    @Field()
    @Column({unique: true}) 
    email!: string

    //ko tra ve password cho graphql vi la bi mat
    @Column() 
    password!: string

    @Field()
    @CreateDateColumn() 
    createdAt: Date

    @Field()
    @UpdateDateColumn() 
    updatedAt: Date
}