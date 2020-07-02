import React, { useState, useEffect, lazy, memo, useCallback } from 'react'
import { Button } from 'antd';

const fetchSearch = async () => await fetch('./search.json').then(res => res.json())

interface IApartment {
    description: string,
    link: string
}

interface IAptListProps {
    perPage: number,
}

const ListItem = (props: IApartment) => {
    const { description, link } = props
    return (
        <li>
            {description}
            <a href={link}>Voir l'annonce</a>
        </li>
    )
}

const AptList = (props: IAptListProps) => {

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
            <Button onClick={() => { refreshList() }}>Test</Button>
            <ul>
                {
                    apartments.map(a => (
                        <ListItem key={a.link} {...a} />
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