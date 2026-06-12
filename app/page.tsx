"use client";

import { Row, Col, Card, Statistic, Collapse } from "antd";
import { GiftOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { BirthdayTable } from "@/components/main/birthdayTable";
import { Notifications } from "@/components/main/notifications";
import { useBirthday } from "@/hooks/useBirthday";
import styles from "@/components/main/Main.module.css";
import FAQ from "@/components/main/faq";

export default function HomePage() {
  const { upcomingBirthdays, loading } = useBirthday();

  return (
    <div className={styles.container}>
      <Row gutter={[24, 24]} style={{ marginBottom: "32px", marginTop: "50px" }}>
        <Col span={6}>
          <Card className={styles.hoverCard}>
            <Statistic title="Именинники" value={upcomingBirthdays.length} prefix={<GiftOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card className={styles.hoverCard}>
            <Statistic title="Статус генерации" value="100%" prefix={<InfoCircleOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={32}>
        <Col xl={16}>
          <Collapse 
            className={styles.customCollapse}
            items={[{ 
              key: "1", 
              label: "Ближайшие дни рождения", 
              children: <BirthdayTable data={upcomingBirthdays} loading={loading} /> 
            }]} 
          />
        </Col>
        <Col xl={8}>
          <Notifications />
        </Col>
        <FAQ />
      </Row>
    </div>
  );
}