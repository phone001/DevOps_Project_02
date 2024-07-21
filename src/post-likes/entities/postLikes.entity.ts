import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Post } from "src/post/model/post.model";
import { User } from "src/user/entities/user.entity";

@Table({
    tableName: "post_likes"
    , timestamps: true
})
export class PostLikes extends Model {
    @Column({
        type: DataType.BOOLEAN
        , allowNull: false
    })
    likes: boolean;

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