import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Comment } from "src/comment/entities/comment.entity";
import { User } from "src/user/entities/user.entity";

@Table({
    tableName: "comment_likes"
    , timestamps: true
})
export class CommentLikes extends Model {
    @Column({
        type: DataType.BOOLEAN
        , allowNull: false
    })
    likes: boolean;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User

    @ForeignKey(() => Comment)
    comment: Comment
}