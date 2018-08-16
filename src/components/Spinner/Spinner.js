import React from 'react';

const Spinner = props =>
    <div className={`spinner ${props.isShown ? 'spinner--is-shown': 'spinner--is-hidden'}`} />

export default Spinner;