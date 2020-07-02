import React, { useState, useEffect, lazy, memo, useCallback } from 'react'

const fetchSearch = async () => await fetch('./search.json').then(res => res.json())

interface IApartment {
    description: string,
    link: string
}

interface IAptListProps {
    perPage: number,
}

const AptList = (props: { perPage: number }) => {

    const [apartments, setApartments] = useState<IApartment[]>([])

    const refreshList = useCallback(async () => {
        setApartments(await fetchSearch())
        console.log(apartments);
    }, [])

    useEffect(() => {
        refreshList()
        return () => { }
    }, [refreshList])

    return (
        <div>
            <button onClick={() => { refreshList() }}>Test</button>
            <ul>
                {
                    apartments.map(a => (
                        <li key={a.link}>
                            {a.description}
                            {a.link}
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

AptList.defaultProps = {
    perPage: 20,
}

export default memo(AptList)