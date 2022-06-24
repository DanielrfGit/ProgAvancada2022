import React from "react";

export default function Product(props) {

    return (
        <div className="product">
            <p className="product--name">{props.item.no_produto}</p>
            <p className="product--description">{props.item.ds_produto}</p>
            <p className="product--price">{props.item.vl_valor}</p>
            <p className="product--price">{props.item.qt_estoque}</p>
            {props.item.qt_estoque==0 && <p className="product--badge">Sold Out</p>}
            <div className="button">
                {props.item.qt_estoque!=0 && <button 
                    className="purchase--button"
                    onClick={event=>props.buy(event, props.item)}
                >
                    Buy
                </button>}
                <br/>
                {props.isAdmin &&
                <button 
                    className="edit--button"
                    onClick={event=>props.alteraProduto(event, props.item)}
                >
                    Alterar produto
                </button>
                }
            </div>
            <hr></hr>
        </div>
    )
}