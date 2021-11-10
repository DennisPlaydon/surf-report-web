import React, { ChangeEventHandler, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import styles from "../../styles/SettingsModal.module.css";

const SettingsModal = (props: any): any => {
    const [minHeight, setMinHeight] = useState(0);
    const [maxHeight, setMaxHeight] = useState(5);

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Settings
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.formBody}>
                <div className={styles.rangeWrapper}>
                    <Form.Label>Min wave height: {minHeight}m</Form.Label>
                    <Form.Range
                        max={5}
                        value={minHeight}
                        min={0}
                        step={0.2}
                        onChange={(e: any) => setMinHeight(e.target.value)}
                    />
                </div>
                <div className={styles.rangeWrapper}>
                    <Form.Label>Max wave height: {maxHeight}m</Form.Label>
                    <Form.Range
                        max={5}
                        min={0}
                        step={0.2}
                        onChange={(e: any) => setMaxHeight(e.target.value)}
                        className={styles.slider}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Save</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SettingsModal;
