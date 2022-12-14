export function FileItemLayout(props) {

    return (
        <>
            <div key={props.keyValue} className="flex justify-between items-left hover:bg-gray-300 rounded-md px-6 py-2">

                <div className="w-3/5m flex items-left justify-left justify-center items-center">
                    <p className="justify-left text-sm">{props.fileName}</p>
                </div>

                <div className="w-2/5 flex justify-between justify-center items-center">

                    <div className="flex justify-end mr-2">
                        <p className="text-sm">{props.fileSize}</p>
                    </div>

                    <div className="flex justify-end justify-center items-center">
                        <p className="text-sm">{props.uploadDate}</p>
                    </div>

                    <button type='button'
                            className='bg-red-500 hover:bg-red-700 text-white font-medium text-xs py-1 px-3 h-8 rounded-md ml-6'
                            onClick={props.onDeleteClick}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </>
    )
}