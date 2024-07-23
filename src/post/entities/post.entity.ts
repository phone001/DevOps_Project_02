import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from '../../user/entities/user.entity';
import { PostLikes } from "src/post-likes/entities/postLikes.entity";
import { Comment } from "src/comment/entities/comment.entity";
@Table({
    tableName: "post"
    , timestamps: true
})
export class Post extends Model {
    @Column({
        type: DataType.STRING(50),
        allowNull: false
    })
    title: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    content: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: true
    })
    imgPath: string;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;


    @HasMany(() => PostLikes, {
        sourceKey: "id",
        foreignKey: "postId",
        onDelete: 'cascade'
    })
    postLikes: PostLikes[];

    @HasMany(() => Comment, {
        sourceKey: "id",
        foreignKey: "postId",
        onDelete: 'cascade'
    })
    comment: Comment[];

}