'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaBell, FaCheck, FaCog, FaRegCircle, FaListUl } from 'react-icons/fa';
import { FaBriefcase } from 'react-icons/fa6';
import { UserProfileIdentityCard } from '../profileSettings';
import type {
  ProfileOverviewCardBase,
  ProfileOverviewCompletionCard,
  ProfileOverviewIconKey,
  ProfileOverviewSummaryCard,
  ProfileOverviewTopicCard,
  ProfileOverviewViewModel,
} from './profileOverview.types';
import styles from './ProfileOverviewClient.module.css';

interface ProfileOverviewPageViewProps {
  viewModel: ProfileOverviewViewModel;
}

function renderIcon(icon: ProfileOverviewIconKey) {
  switch (icon) {
    case 'briefcase':
      return <FaBriefcase aria-hidden="true" />;
    case 'list':
      return <FaListUl aria-hidden="true" />;
    case 'bell':
      return <FaBell aria-hidden="true" />;
    case 'cog':
      return <FaCog aria-hidden="true" />;
  }
}

function OverviewCard({
  title,
  description,
  ctaHref,
  ctaLabel,
  children,
}: ProfileOverviewCardBase & { children: React.ReactNode }) {
  return (
    <section className={styles.card}>
      <header className={styles.cardHeader}>
        <div className={styles.cardTitleGroup}>
          <h2 className={`type-title-sm ${styles.title}`}>{title}</h2>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>
        <Link href={ctaHref} className={`${styles.cta} button button--outline button--outline-small`}>
          {ctaLabel}
          <FaArrowRight aria-hidden="true" />
        </Link>
      </header>
      {children}
    </section>
  );
}

function CompletionCard({ card }: { card: ProfileOverviewCompletionCard }) {
  return (
    <OverviewCard {...card}>
      <div className={styles.progressBlock}>
        <p className={styles.metaValue}>{card.percentage}%</p>
        <p className={styles.metaCaption}>{card.caption}</p>
        <div className={styles.progressTrack} aria-hidden="true">
          <div className={styles.progressBar} style={{ width: `${card.percentage}%` }} />
        </div>
      </div>

      <div className={styles.completionList}>
        {card.items.map((item) => (
          <div key={item.key} className={styles.completionItem}>
            <span
              className={`${styles.statusIcon} ${item.complete ? styles.statusComplete : styles.statusPending}`}
              aria-hidden="true"
            >
              {item.complete ? <FaCheck /> : <FaRegCircle />}
            </span>
            <p className={styles.summaryLabel}>{item.label}</p>
            <p className={styles.summaryValue}>
              {item.complete ? item.completeLabel : item.incompleteLabel}
            </p>
          </div>
        ))}
      </div>
    </OverviewCard>
  );
}

function TopicCard({ card }: { card: ProfileOverviewTopicCard }) {
  return (
    <OverviewCard {...card}>
      <div className={styles.topicList}>
        <div className={styles.topicPillRow}>
          {card.topics.map((topic) => (
            <span key={topic.label} className={styles.topicPill}>
              {topic.icon ? renderIcon(topic.icon) : null}
              {topic.label}
            </span>
          ))}
        </div>
        <p className={styles.topicNote}>{card.note}</p>
      </div>
    </OverviewCard>
  );
}

function SummaryCard({ card }: { card: ProfileOverviewSummaryCard }) {
  return (
    <OverviewCard {...card}>
      <div className={styles.summaryList}>
        {card.items.map((item) => (
          <div key={item.key} className={styles.summaryItem}>
            <span
              className={`${styles.statusIcon} ${item.tone === 'success' ? styles.statusComplete : ''}`}
              aria-hidden="true"
            >
              {renderIcon(item.icon)}
            </span>
            <p className={styles.summaryLabel}>{item.label}</p>
            <p className={styles.summaryValue}>{item.value}</p>
          </div>
        ))}
      </div>
    </OverviewCard>
  );
}

export function ProfileOverviewPageView({ viewModel }: ProfileOverviewPageViewProps) {
  return (
    <section className={styles.section} aria-label={viewModel.loadingAriaLabel}>
      <div className={styles.topRow}>
        <div className={styles.identitySlot}>
          <UserProfileIdentityCard {...viewModel.identityCardProps} />
        </div>

        <CompletionCard card={viewModel.completionCard} />
      </div>

      <div className={styles.summaryGrid}>
        <TopicCard card={viewModel.ordersCard} />
        <TopicCard card={viewModel.requestsCard} />
        <SummaryCard card={viewModel.notificationsCard} />
        <SummaryCard card={viewModel.preferencesCard} />
      </div>
    </section>
  );
}

export const ProfileOverviewView = ProfileOverviewPageView;
