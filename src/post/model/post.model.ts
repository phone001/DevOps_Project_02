import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";

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
}