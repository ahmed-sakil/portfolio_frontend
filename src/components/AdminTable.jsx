const AdminTable = ({ data, columns, onEdit, onDelete, type }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10 text-text-muted">
        <p>No records found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-text-muted text-sm uppercase tracking-wider">
            {columns.map((col, index) => (
              <th key={index} className="p-4 font-bold">{col.header}</th>
            ))}
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-white divide-y divide-white/5">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-white/5 transition">
              {columns.map((col, index) => (
                <td key={index} className="p-4 text-sm">
                  {/* Handle Boolean (isFeatured) */}
                  {col.key === 'isFeatured' ? (
                    item.isFeatured ? (
                      <span className="text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20"><i className="ri-check-line"></i> Yes</span>
                    ) : (
                      <span className="text-white/20"><i className="ri-close-line"></i> No</span>
                    )
                  ) : 
                  /* Handle Dates */
                  col.key === 'createdAt' || col.key === 'startDate' ? (
                     new Date(item[col.key]).toLocaleDateString() 
                  ) : (
                    /* Handle Text (Truncate) */
                    item[col.key]?.toString().substring(0, 50) + (item[col.key]?.length > 50 ? '...' : '')
                  )}
                </td>
              ))}
              
              {/* ACTION BUTTONS */}
              <td className="p-4 text-right space-x-2">
                
                {type === 'messages' ? (
                    <button 
                    onClick={() => onEdit(item)}
                    className="p-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500 hover:text-white transition"
                    title="View Details"
                    >
                    <i className="ri-eye-line"></i>
                    </button>
                ) : (
                    <button 
                    onClick={() => onEdit(item)}
                    className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition"
                    title="Edit"
                    >
                    <i className="ri-pencil-line"></i>
                    </button>
                )}

                <button 
                  onClick={() => onDelete(item.id)}
                  className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition"
                  title="Delete"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;