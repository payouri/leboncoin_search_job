import React, { memo } from 'react'
import { Carousel, Card, Row, Col, Tag, Empty, Typography, Space } from 'antd';
import { InfoCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;
export interface ITimeAgoTemplatesOverride {
    [key: string]: string
}

export interface ITimeAgoOptions {
    templates?: ITimeAgoTemplatesOverride,
}

type ITimeAgoDefaultTemplates = {
    prefix: "",
    suffix: "",
    seconds: ">1min",
    minute: "1min",
    minutes: "%dmin",
    hour: "1h",
    hours: "%dh",
    day: "1j",
    days: "%dj",
    month: "1m",
    months: "%dm",
    year: "1a",
    years: "%da"
}


const timeAgo = function (time: Date | string, options: ITimeAgoOptions = {}): string | undefined {

    const { templates } = options

    const defaultTemplates: ITimeAgoDefaultTemplates = {
        prefix: "",
        suffix: "",
        seconds: ">1min",
        minute: "1min",
        minutes: "%dmin",
        hour: "1h",
        hours: "%dh",
        day: "1j",
        days: "%dj",
        month: "1m",
        months: "%dm",
        year: "1a",
        years: "%da"
    };

    const currentTemplates: any = { ...defaultTemplates, ...templates }


    const getTemplate = function (t: string, n: number): string {
        return currentTemplates[t] && currentTemplates[t].replace(/%d/i, Math.abs(Math.round(n)));
    };

    const timer = function (time: Date | string): string | undefined {

        if (!time) return;
        if (!isNaN(Number(time))) time = new Date(time);
        if (time instanceof Date) time = String(time);

        time = time.replace(/\.\d+/, ""); // remove milliseconds
        time = time.replace(/-/, "/").replace(/-/, "/");
        time = time.replace(/T/, " ").replace(/Z/, " UTC");
        time = time.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
        time = new Date(time);

        const now = new Date();
        const seconds = ((now.getTime() - time.getTime()) * .001) >> 0;
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;
        const years = days / 365;

        return currentTemplates.prefix + (
            (seconds < 45 && getTemplate('seconds', seconds)) ||
            (seconds < 90 && getTemplate('minute', 1)) ||
            (minutes < 45 && getTemplate('minutes', minutes)) ||
            (minutes < 90 && getTemplate('hour', 1)) ||
            (hours < 24 && getTemplate('hours', hours)) ||
            (hours < 42 && getTemplate('day', 1)) ||
            (days < 30 && getTemplate('days', days)) ||
            (days < 45 && getTemplate('month', 1)) ||
            (days < 365 && getTemplate('months', days / 30)) ||
            (years < 1.5 && getTemplate('year', 1)) ||
            getTemplate('years', years)) + currentTemplates.suffix;
    };
    return timer(time);
}

export interface IApartment {
    date: string,
    price?: number,
    title: string,
    description: string,
    link: string,
    images?: string[],
    owner: {
        type: "private" | "pro"
    }
}

export interface IAptListProps {
    perPage: number,
    textFilter?: string,
    apartments: IApartment[],
    loading: boolean,
}

const ownerTag = ({ type } : IApartment['owner']) => type === 'private' ? <Tag color="purple">Particulier</Tag> : <Tag color="red">Agence</Tag>

const ListItem = (props: IApartment) => {
    let { description, link, title, images, price, date, owner } = props
    description = description.length >= 200 ? description.substring(0, 200) + '...' : description
    description = description.replace(new RegExp('\\r\\n', 'g'), '<br>')
    return (
        <Col md={{
            span: 12
        }}>
            <Card
                actions={[<a target={'_blank'} rel="noopener noreferrer" href={link}>Voir l'annonce</a>]}
                extra={[<Space>{ownerTag(owner)}<Tag color="default" icon={<ClockCircleOutlined />}>{`${timeAgo(date)}`}</Tag><Tag color="green" icon={<InfoCircleOutlined />}>{`${price}€`}</Tag></Space>]}
                title={title}
                cover={
                    <div style={{ display: 'block', height: '20rem', width: '100%' }}>
                        <Carousel
                            // autoplay
                            lazyLoad='progressive'
                            style={{
                                flex: '0 0 100%',
                                height: 'inherit',
                                width: 'inherit'
                            }}
                        >
                            {Array.isArray(images) ?
                                images.map(img => (
                                    <div style={{ height: '100%', width: '100%', maxWidth: '100%', maxHeight: '100%' }}>
                                        <img style={{ objectFit: 'cover', height: '20rem', width: '100%' }} src={img} alt="" />
                                    </div>
                                )) :
                                <Empty />
                            }
                        </Carousel>
                    </div>
                }
            >
                <Paragraph ellipsis={{ rows: 4, expandable: true, symbol: 'more' }} style={{ marginTop: '.25rem' }}>{description}</Paragraph>
            </Card>
        </Col>
    )
}

const AptList = (props: IAptListProps) => {

    const { textFilter, apartments, loading } = props

    return (
        <>
            <Row gutter={[16, 16]}
                style={{
                    //     listStyle: 'none',
                    //     padding: 0,
                    margin: 0,
                }}
            >
                {!loading
                    ? apartments && apartments.filter(a => !textFilter || a.description.indexOf(textFilter) > -1 || a.title.indexOf(textFilter) > -1).map(a => (
                        <ListItem key={a.link} {...a} />
                    ))
                    : Array.from({ length: 6 }, (v, k) => k).map(index => (
                        <Col md={{
                            span: 12
                        }}>
                            <Card loading={true} key={index} />
                        </Col>
                    ))
                }
            </Row>
        </>
    )
}

AptList.defaultProps = {
    perPage: 20,
    apartments: [],
    loading: false,
}

export default memo(AptList)