import React from 'react';
import { getTableData } from '../../Utils/tableDataFormatter';

const ImageInfo = ({ imageData, selectedPage }) => {
    const tableData = imageData ? getTableData(imageData, selectedPage) : {};
    
    return (
        <div className="modal__info">
            {imageData && Object.entries(tableData).map(([title, rows]) => (
                <div key={title} className="modal__info-section">
                    <h3 className="modal__info-section__title">{title}</h3>
                    <table className="modal__info-table">
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={index}>
                                    {row.type === 'double' ? (
                                        <>
                                            <th>{row.left.label}</th>
                                            <td>{row.left.value}</td>
                                            <th>{row.right.label}</th>
                                            <td>{row.right.value}</td>
                                        </>
                                    ) : (
                                        <>
                                            <th>{row.label}</th>
                                            <td colSpan="3">{row.value}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default ImageInfo;