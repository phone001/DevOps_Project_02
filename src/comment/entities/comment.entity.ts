import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Post } from "src/post/model/post.model";
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
}