import EntryCard from "./EntryCard"

function EntryGrid({ entries,onEdit,onDelete,searchQuery,encryptionKey }) {

  if(entries.length==0 && searchQuery?.trim()){
    return(
      <div className="flex items-center justify-center h-40 text-gray-300 text-lg font-jet">
        No results found for "{searchQuery}"
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4">
      {
        entries.map((entry) => (
          <EntryCard 
            key={entry._id} 
            entry={entry}
            onEdit={onEdit}  
            onDelete={onDelete}
            encryptionKey={encryptionKey}
          />
        ))
      }
    </div>
  )
}

export default EntryGrid