import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { CommentLikes } from "src/comment-likes/entities/commentLikes.entity";
import { Post } from "src/post/entities/post.entity";
import { User } from "src/user/entities/user.entity";

@Table({
    tableName: "comment"
    , timestamps: true
})
export class Comment extends Model {
    @Column({
        type: DataType.STRING(150),
        allowNull: false
    })
    content: string

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => Post)
    @Column
    postId: number;

    @BelongsTo(() => Post)
    post: Post

    @HasMany(() => CommentLikes, {
        sourceKey: "id",
        foreignKey: "commentId",
        onDelete: 'cascade'

    })
    commentLikes: CommentLikes[];
}