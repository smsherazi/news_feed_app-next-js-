'use client'

import React, { useState } from "react";
import Image from "next/image";
import styles from '@/Component Css/AiNewsSearch.module.css';
import { IoSend,IoLogoReddit, IoLogoTableau, IoLogoElectron  } from "react-icons/io5";
import { GiCancel } from "react-icons/gi";

const AiNewsSearch = () => {
    const [expanded, setExpanded] = useState(false);
    const [query, setQuery] = useState("");

    const toggleSearch = () => setExpanded(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            console.log("Searching:", query);
            setQuery("");
        }
    };

    return (
        <div className={styles.aiNewsContainer}>
            <form
                className={`${styles.searchBox} ${expanded ? styles.expanded : ""}`}
                onSubmit={handleSubmit}
            >
                {expanded ? (
                    <>
                        <textarea
                            className={styles.searchInput}
                            placeholder="Search anything about news..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === " " && e.currentTarget.selectionStart === 0) {
                                    e.preventDefault();
                                }
                            }}
                        />
                        <div className={styles.iconContainer}>
                            {query === "" ? (
                                <button
                                    type="button"
                                    className={styles.iconBtn}
                                    onClick={() => setExpanded(false)}
                                >
                                    <GiCancel size={20} />
                                </button>
                            ) : (
                                <button type="submit" className={styles.iconBtn}>
                                    <IoSend size={20} />
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={toggleSearch}
                    >
                        <IoLogoReddit  />
                    </button>
                )}
            </form>
        </div>
    );
};

export default AiNewsSearch;
