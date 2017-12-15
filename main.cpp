#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

Node *remove(Node *first, int x)
{
    while (first->next && first->next->data == x) {
        Node *tmp = first->next;
        first->next = tmp->next;
        free(tmp);
    }
    if (first->next) remove(first->next, x);
    // 如果第一个节点值是 x，那就返回第二个节点
    if (first->data == x) {
        Node *second = first->next;
        free(first);
        return second;
    }
    return first;
}

Node *create(int *arr, int length) {
    Node *first = NULL, *last = NULL;
    for (int i = 0; i < length; i++) {
        Node *node = (Node *)malloc(sizeof(Node));
        node->data = arr[i];
        node->next = NULL;
        if (!first) last = first = node;
        else last->next = node, last = last->next;
    }
    return first;
}

void output(Node *list) {
    for(; list; list = list->next)
        printf("%d ", list->data);
}

int main()
{
    int arr[] = {1, 1, 2, 3, 1, 2, 3, 3};

    Node *list = create(arr, 8);

    list = remove(list, 1);

    output(list);

    return 0;
}