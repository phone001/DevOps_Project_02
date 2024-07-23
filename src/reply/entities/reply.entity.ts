import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Comment } from "src/comment/entities/comment.entity";
import { ReplyLikes } from "src/reply-likes/entitys/replyLikes.entity";
import { User } from "src/user/entities/user.entity";

@Table({
    tableName: "reply"
    , timestamps: true
})
export class Reply extends Model {
    @Column({
        type: DataType.STRING(150)
        , allowNull: false
    })
    content: string;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => Comment)
    @Column
    commentId: number;

    @BelongsTo(() => Comment)
    comment: Comment;

    @HasMany(() => ReplyLikes, {
        sourceKey: "id",
        foreignKey: "replyId",
        onDelete: 'cascade'
    })
    replyLikes: ReplyLikes[];
}