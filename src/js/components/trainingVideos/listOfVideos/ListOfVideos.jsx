/**
 * ListOfVideos.jsx
 * Created by Brian Petway 12/05/22
 */

import React, { useState } from 'react';
import PropTypes from "prop-types";
import { FlexGridRow, FlexGridCol } from "data-transparency-ui";
import VideoCard from '../videoCard/VideoCard';
import TrainingVideoModal from "../../sharedComponents/TrainingVideoModal";

const propTypes = {
    videos: PropTypes.array
};

const ListOfVideos = ({ videos }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const onClick = () => {
        setIsModalOpen(true);
    };

    const onKeyUp = (e) => {
        if (e.keyCode === 13) {
            onClick();
        }
    };
    return (
        <section className="list-of-videos__section">
            <div className="grid-content">
                <FlexGridRow hasGutter gutterSize="lg">
                    {videos.map((video) => (
                        <FlexGridCol
                            key={video.id}
                            desktopxl={4}
                            desktop={6}
                            tablet={12}
                            mobile={12}
                            className="list-of-videos__video">
                            <VideoCard
                                tabIndex="0"
                                key={video.id}
                                thumbnailUrl={video.thumbnails.maxres.url}
                                title={video.title}
                                duration={video.duration}
                                publishedAt={video.publishedAt}
                                description={video.description}
                                onClick={onClick}
                                onKeyUp={onKeyUp} />
                        </FlexGridCol>))
                    }
                </FlexGridRow>
            </div>
        </section>);
};

ListOfVideos.propTypes = propTypes;
export default ListOfVideos;

