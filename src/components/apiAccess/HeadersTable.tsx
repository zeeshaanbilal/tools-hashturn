interface HeadersMap {
    [key: string]: string;
  }

interface HeadersTableProps {
    headers: HeadersMap;
  }
  
  const HeadersTable: React.FC<HeadersTableProps> = ({ headers }) => {
    return (
      <div className="w-full overflow-x-auto rounded border">
        <table className="min-w-[520px] w-full text-sm">
          <tbody>
            {Object.entries(headers).map(([key, val]) => (
              <tr key={key}>
                <td className="border-t p-2 font-mono">{key}</td>
                <td className="border-t p-2 font-mono">{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default HeadersTable;
  