import { Model, Table, DataType, Column, AutoIncrement, PrimaryKey, AllowNull, HasMany } from "sequelize-typescript";


@Table({
    modelName: "users",
    tableName: "User",
    timestamps: true,
    underscored: false
})
export class User extends Model {
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
    })
    id: number;

    //email
    @Column({
        type: DataType.STRING(50),
        allowNull: false
    })
    loginId: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false
    })
    password: string;

    @Column({
        type: DataType.STRING(),
    })
    nickname: string;

    @Column({
        type: DataType.STRING(10),
        allowNull: false
    })
    oauthType: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    imgPath: string;

    @HasMany(() => Post, {
        sourceKey: "id",
        foreignKey: "userId"

    })
    posts: Post[];

    @HasMany(() => Comment, {
        sourceKey: "id",
        foreignKey: "userId"
    })
    comments: Comment[];

    @HasMany(() => Reply, {
        sourceKey: "id",
        foreignKey: "userId"
    })
    reply: Reply[];

    @HasMany(() => PostLikes, {
        sourceKey: "id",
        foreignKey: "userId"
    })
    postLikes: PostLikes[];

    @HasMany(() => CommentLikes, {
        sourceKey: "id",
        foreignKey: "userId"
    })
    commentLikes: CommentLikes[];


    @HasMany(() => ReplyLikes, {
        sourceKey: "id",
        foreignKey: "userId"
    })
    replyLikes: ReplyLikes[];
}
