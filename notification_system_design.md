# Stage 1

## Approach to Priority Inbox and Sorting
To implement the Priority Inbox, the notifications are fetched from the API and filtered to include only "unread" items. The sorting logic is based on a composite priority key:

1. **Category Weight:** Notifications are assigned a numerical weight based on their category: Placement (High, e.g., 3), Result (Medium, e.g., 2), and Event (Low, e.g., 1).
2. **Recency:** If the category weights are identical, the creation timestamp is used as a tie-breaker, favoring more recent notifications.

This ensures that a new Placement notification always supersedes older Result or Event notifications, while maintaining chronological order within the same category.

## Efficiently Maintaining the Top 10 Notifications
As new notifications flow into the system continuously, resorting the entire list of notifications every time a new one arrives would be inefficient (\O(N \log N)\ time complexity).

To maintain the Top 10 efficiently, we use a **Min-Heap (Priority Queue)** constrained to a size of k (where k = 10):

1. **Initialization:** The first 10 unread notifications are inserted into the Min-Heap. The heap is ordered by our priority rules, so the least important notification of the Top 10 sits at the root.
2. **Processing New Notifications:** For every subsequent unread notification, we compare its priority to the root of the Min-Heap.
3. **Heap Update:** If the new notification has a higher priority (greater weight or more recent if weights are equal) than the root, we extract the root and insert the new notification.

**Time Complexity:**
- Processing a new notification: O(\log k)
Since k = 10, the insertion time is effectively O(1) constant time, making this approach highly scalable and efficient even with high-frequency streams.
