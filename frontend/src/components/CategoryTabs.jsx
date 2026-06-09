const CATEGORIES = ['All', 'Work', 'Personal', 'Finance', 'Developer']

function CategoryTabs({activeTab = 'All',onTabChange=()=>{}}) {
  return (
    <div className="flex items-center gap-2 px-5 mb-4">
      {CATEGORIES.map((category)=>(
        <button 
          key={category} 
          onClick={()=>onTabChange(category)}
          className={`px-4 py-2 rounded-lg transition-all duration-200 font-jet ${
            activeTab===category ? 'text-white bg-[#008B1E] font-medium' : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          >
            {category}
          </button>
      ))}
    </div>
  )
}

export default CategoryTabs