export default function TailButton({caption, color, handleClick, size}) {
  const btColor = {
    'blue' : 'bg-blue-800' ,
    'orange' : 'bg-orange-800',
    'gray' : 'bg-gray-600',
    'green' : 'bg-green-800',
    'yellow' : 'bg-yellow-900',
    'red' : 'bg-red-800'

  };

  const btColorHover = {
    'blue' : 'hover:bg-blue-600' ,
    'orange' : 'hover:bg-orange-600',
    'gray' : 'hover:bg-gray-400',
    'green' : 'hover:bg-green-600',
    'yellow' : 'hover:bg-yellow-400',
    'red' : 'hover:bg-red-600'
  };


  return (
    <button className={`inline-flex justify-center items-center
                       p-3 mx-2
                       ${btColor[color]} text-white
                       ${btColorHover[color]} font-bold
                       rounded-md
                       ${size ? size : ''}
                       `}
            onClick={handleClick}>
      {caption}
    </button>
  )
}