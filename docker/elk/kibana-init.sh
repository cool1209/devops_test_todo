#!/bin/bash

# Wait for Elasticsearch to be available
while ! curl -s http://elasticsearch:9200 > /dev/null; do
    echo "Waiting for Elasticsearch..."
    sleep 5
done

echo "Elasticsearch is up! Creating index pattern..."

# Create Kibana index pattern
curl -X POST "http://kibana:5601/api/saved_objects/index-pattern/todos" \
     -H "kbn-xsrf: true" \
     -H "Content-Type: application/json" \
     -d'
{
  "attributes": {
    "title": "todos-*",
    "timeFieldName": "timestamp"
  }
}
'

echo "Index pattern created!"

# Create Todo Status Chart visualization
curl -X POST "http://kibana:5601/api/saved_objects/visualization/todo-status-chart" \
     -H "kbn-xsrf: true" \
     -H "Content-Type: application/json" \
     -d'
{
  "attributes": {
    "title": "Todo Status Distribution",
    "visState": "{\"title\":\"Todo Status Distribution\",\"type\":\"pie\",\"params\":{\"type\":\"pie\",\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"isDonut\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"segment\",\"params\":{\"field\":\"data.completed\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\"}}]}"
  }
}
'

echo "Todo Status Chart visualization created!"

# Create Todo Events Over Time visualization
curl -X POST "http://kibana:5601/api/saved_objects/visualization/todo-events-over-time" \
     -H "kbn-xsrf: true" \
     -H "Content-Type: application/json" \
     -d'
{
  "attributes": {
    "title": "Todo Events Over Time",
    "visState": "{\"title\":\"Todo Events Over Time\",\"type\":\"line\",\"params\":{\"type\":\"line\",\"grid\":{\"categoryLines\":false,\"style\":{\"color\":\"#eee\"}},\"categoryAxes\":[{\"id\":\"CategoryAxis-1\",\"type\":\"category\",\"position\":\"bottom\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\"},\"labels\":{\"show\":true,\"truncate\":100},\"title\":{}}],\"valueAxes\":[{\"id\":\"ValueAxis-1\",\"name\":\"LeftAxis-1\",\"type\":\"value\",\"position\":\"left\",\"show\":true,\"style\":{},\"scale\":{\"type\":\"linear\",\"mode\":\"normal\"},\"labels\":{\"show\":true,\"rotate\":0,\"filter\":false,\"truncate\":100},\"title\":{\"text\":\"Count\"}}],\"seriesParams\":[{\"show\":\"true\",\"type\":\"line\",\"mode\":\"normal\",\"data\":{\"label\":\"Count\",\"id\":\"1\"},\"valueAxis\":\"ValueAxis-1\",\"drawLinesBetweenPoints\":true,\"showCircles\":true}],\"addTooltip\":true,\"addLegend\":true,\"legendPosition\":\"right\",\"times\":[],\"addTimeMarker\":false},\"aggs\":[{\"id\":\"1\",\"enabled\":true,\"type\":\"count\",\"schema\":\"metric\",\"params\":{}},{\"id\":\"2\",\"enabled\":true,\"type\":\"date_histogram\",\"schema\":\"segment\",\"params\":{\"field\":\"timestamp\",\"timeRange\":{\"from\":\"now-7d\",\"to\":\"now\"},\"useNormalizedEsInterval\":true,\"interval\":\"auto\",\"drop_partials\":false,\"min_doc_count\":1,\"extended_bounds\":{}}},{\"id\":\"3\",\"enabled\":true,\"type\":\"terms\",\"schema\":\"group\",\"params\":{\"field\":\"type.keyword\",\"size\":5,\"order\":\"desc\",\"orderBy\":\"1\",\"otherBucket\":false,\"otherBucketLabel\":\"Other\",\"missingBucket\":false,\"missingBucketLabel\":\"Missing\"}}]}"
  }
}
'

echo "Todo Events Over Time visualization created!"

# Create Todo Dashboard
curl -X POST "http://kibana:5601/api/saved_objects/dashboard/todo-dashboard" \
     -H "kbn-xsrf: true" \
     -H "Content-Type: application/json" \
     -d'
{
  "attributes": {
    "title": "Todo Application Dashboard",
    "hits": 0,
    "description": "Dashboard for monitoring Todo application events and metrics",
    "panelsJSON": "[{\"version\":\"7.13.0\",\"gridData\":{\"x\":0,\"y\":0,\"w\":24,\"h\":15,\"i\":\"1\"},\"panelIndex\":\"1\",\"embeddableConfig\":{},\"panelRefName\":\"panel_1\"},{\"version\":\"7.13.0\",\"gridData\":{\"x\":24,\"y\":0,\"w\":24,\"h\":15,\"i\":\"2\"},\"panelIndex\":\"2\",\"embeddableConfig\":{},\"panelRefName\":\"panel_2\"}]",
    "optionsJSON": "{\"useMargins\":true,\"hidePanelTitles\":false}",
    "timeRestore": false,
    "kibanaSavedObjectMeta": {
      "searchSourceJSON": "{\"query\":{\"language\":\"kuery\",\"query\":\"\"},\"filter\":[]}"
    }
  },
  "references": [
    {
      "name": "panel_1",
      "type": "visualization",
      "id": "todo-status-chart"
    },
    {
      "name": "panel_2",
      "type": "visualization",
      "id": "todo-events-over-time"
    }
  ]
}
'

echo "Todo Dashboard created!"

echo "Kibana setup complete!" 