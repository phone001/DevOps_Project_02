import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Reply } from "src/reply/entities/reply.entity";
import { User } from "src/user/entities/user.entity";

@Table({
    tableName: "reply_likes"
    , timestamps: true
})
export class ReplyLikes extends Model {
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

    @ForeignKey(() => Reply)
    @Column
    replyId: number;

    @BelongsTo(() => Reply)
    reply: Reply
}