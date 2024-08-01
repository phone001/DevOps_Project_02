import { Model, Table, DataType, Column, AutoIncrement, PrimaryKey, AllowNull, HasMany } from "sequelize-typescript";
import { CommentLikes } from "src/comment-likes/entities/commentLikes.entity";
import { Comment } from "src/comment/entities/comment.entity";
import { PostLikes } from "src/post-likes/entities/postLikes.entity";
import { Post } from "src/post/entities/post.entity";
import { ReplyLikes } from "src/reply-likes/entitys/replyLikes.entity";
import { Reply } from "src/reply/entities/reply.entity";

@Table({
    // modelName: "users",
    tableName: "user",
    timestamps: true,
    underscored: false
})
export class User extends Model {
    // @PrimaryKey
    // @AutoIncrement
    // @Column({
    //     type: DataType.INTEGER
    // })
    // id: number;

    //email
    @Column({
        type: DataType.STRING(50),
        allowNull: false
    })
    loginId: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true
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
        foreignKey: "userId",
        // onDelete: "CASCADE"
    })
    posts: Post[];

    @HasMany(() => Comment, {
        sourceKey: "id",
        foreignKey: "userId",
        // onDelete: "cascade"
    })
    comments: Comment[];

    @HasMany(() => Reply, {
        sourceKey: "id",
        foreignKey: "userId",
        // onDelete: "cascade"
    })
    reply: Reply[];

    @HasMany(() => PostLikes, {
        sourceKey: "id",
        foreignKey: "userId",
        // onDelete: "cascade"
    })
    postLikes: PostLikes[];

    @HasMany(() => CommentLikes, {
        sourceKey: "id",
        foreignKey: "userId",
        // onDelete: "cascade"
    })
    commentLikes: CommentLikes[];


    @HasMany(() => ReplyLikes, {
        sourceKey: "id",
        foreignKey: "userId",
        // onDelete: "cascade"
    })
    replyLikes: ReplyLikes[];
}
