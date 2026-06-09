import EntryCard from "./EntryCard"

function EntryGrid({ entries,onEdit,onDelete,searchQuery }) {

  if(entries.length==0 && searchQuery?.trim()){
    return(
      <div className="flex items-center justify-center h-40 text-gray-300 text-lg font-jet">
        No results found for "{searchQuery}"
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {
        entries.map((entry) => (
          <EntryCard 
            key={entry._id} 
            entry={entry}
            onCopy={(pw) => {navigator.clipboard.writeText(pw)} } 
            onEdit={onEdit}  
            onDelete={onDelete}
          />
        ))
      }
    </div>
  )
}

export default EntryGrid