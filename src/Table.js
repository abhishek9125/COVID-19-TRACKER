import React from 'react';
import numeral from "numeral";
import './Table.css';

function Table({ countries }) {
    return (
        <div className="table">
            {countries.map(({country,cases}) => (  //Or we can just use country here and use country.cases and country.country in td
                <tr>
                    <td>{country}</td>
                    <td><strong>{numeral(cases).format("0,0")}</strong></td>
                </tr>
            ))};
        </div>
    )
}

export default Table
